class CreateChangeRequestPhotos < ActiveRecord::Migration[5.1]
  def change

    create_table :change_request_photos do |t|
      t.belongs_to :photo, index: true
      t.belongs_to :change_request, index: true
    end
  end
end
