class AddDeletedToItems < ActiveRecord::Migration[5.1]
  def change
    add_column :items, :deleted, :boolean, default: false
  end
end
