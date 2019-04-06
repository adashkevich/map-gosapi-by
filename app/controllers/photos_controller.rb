class PhotosController < ApplicationController
  before_action :file_size_validation, only: [:create]

  # POST /photos
  def create
    saved_file = GoogleCloud.instance.bucket.create_file params['file'].path, new_file_name(params['file'])
    render plain: saved_file.public_url
  end

  private

  def new_file_name(file)
    'map/' + SecureRandom.uuid + File.extname(file.original_filename)
  end

  def file_size_validation
    render plain: '', status: :payload_too_large if params['file'].size > 10_000_000
  end
end
