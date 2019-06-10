class ChangeRequestPhoto < ApplicationRecord
  belongs_to :change_request
  belongs_to :photo
end
