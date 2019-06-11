class CreateChangeRequests < ActiveRecord::Migration[5.1]
  def change
    create_table :change_requests do |t|
      t.string :request_type
      t.string :coordinates
      t.integer :height
      t.boolean :accept
      t.belongs_to :item

      t.timestamps
    end
  end
end
