class Item < ApplicationRecord

  has_many :item_photos
  has_many :photos, through: :item_photos

  accepts_nested_attributes_for :photos

  # before_update do
  #   self.processed = true unless (changed - ['lock']).empty?
  # end
end
