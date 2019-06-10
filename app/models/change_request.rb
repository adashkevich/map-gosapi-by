class ChangeRequest < ApplicationRecord

  has_many :change_request_photos
  has_many :photos, through: :change_request_photos
  accepts_nested_attributes_for :photos
  belongs_to :item

  def changed_item
    item = self.item.dup
    item.parent_id = self.item.id
    item.height = height
    item.coordinates = coordinates
    item.photos = photos
    item.lock = false
    item.deleted = false
    item.processed = true
    item
  end

  def delete_item
    item.update deleted: true
  end

  def accept_request
    if item.item_type == 'border'
      if request_type == 'update'
        item = changed_item
        @errors = item.errors and return false unless item.save
      end

      if delete_item
        update accept: true
        return true
      else
        @errors = item.errors
      end
    end
    false
  end

  def decline_request
    if update(accept: false)
      item.update lock: false unless ChangeRequest.where(item_id: item.id, accept: nil).first.present?
      true
    end
  end
end
