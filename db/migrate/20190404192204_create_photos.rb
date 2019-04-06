class CreatePhotos < ActiveRecord::Migration[5.1]
  def change
    create_table :photos do |t|
      t.string :url, null: false
      t.string :name, null: false
      t.integer :size, null: false

      t.belongs_to :item, index: true

      t.timestamps
    end
  end
end
