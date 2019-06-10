class ItemPhoto < ApplicationRecord
  belongs_to :item
  belongs_to :photo
end