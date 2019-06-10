class CreateItemPhotos < ActiveRecord::Migration[5.1]
  def change
    create_table :item_photos do |t|
      t.belongs_to :photo, index: true
      t.belongs_to :item, index: true
    end
  end
end
