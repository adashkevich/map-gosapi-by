class AddProblemToItems < ActiveRecord::Migration[5.1]
  def change
    add_column :items, :problem_id, :integer
    add_column :items, :problem_href, :string
    add_column :items, :processed, :boolean, default: true
    add_column :items, :problem_status, :string
    add_column :items, :problem_answer, :string
    add_column :items, :lock, :boolean, default: false
    add_column :items, :submitter_name, :string
  end
end
