class CreateItems < ActiveRecord::Migration[5.1]
  def change
    create_table :items do |t|
      t.string :item_type
      t.string :coordinates, null: false
      t.integer :height

      t.timestamps
    end
  end
end
