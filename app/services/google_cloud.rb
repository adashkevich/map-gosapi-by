require 'singleton'
require 'google/cloud/storage'

class GoogleCloud
  include Singleton

  def initialize
    @storage = Google::Cloud::Storage.new(
      project_id: ENV['MAP_GOSAPI_GOOGLE_CLOUD_PROJECT_ID'],
      credentials: ENV['MAP_GOSAPI_GOOGLE_CLOUD_KEYSTORE']
    )
    @bucket = @storage.bucket 'filestore.gosapi.by'
  end

  attr_reader :bucket
end
