class AddParentIdToItem < ActiveRecord::Migration[5.1]
  def change
    add_column :items, :parent_id, :integer
  end
end
