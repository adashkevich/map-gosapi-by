class AddCountAndPlantDateToItems < ActiveRecord::Migration[5.1]
  def change
    add_column :items, :count, :integer
    add_column :items, :plant_date, :date
  end
end
