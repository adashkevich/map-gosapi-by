class ChangeRequestsController < ApplicationController
  before_action :set_change_request, only: [:show, :accept, :decline]

  # GET /change_requests
  def index
    @change_requests = ChangeRequest.eager_load(:photos, :item).where accept: nil

    render json: @change_requests, include: [:item, :photos]
  end

  # GET /change_requests/1
  # def show
  #   render json: @change_request
  # end

  # POST /change_requests
  def create
    @change_request = ChangeRequest.new(change_request_params)
    item = Item.find(@change_request.item_id)

    if item.lock?
      render(json: {message: 'Запрос на изменение данного элемента уже отправлен.'}, status: :unprocessable_entity) and return
    end

    if @change_request.photos.present?
      @change_request.photos = @change_request.photos.map do |photo|
        existing_photo = Photo.where(url: photo.url).first
        existing_photo.present? ? existing_photo : photo
      end
    end


    if @change_request.request_type == 'delete'
      @change_request.photos = @change_request.item.photos
      @change_request.coordinates = @change_request.item.coordinates
    end

    at_least_one_saved = false
    @change_request.coordinates.split(';').each do |point|
      cr = @change_request.dup
      cr.photos = @change_request.photos
      cr.coordinates = point
      cr.save && at_least_one_saved = true
    end

    if at_least_one_saved
      item.update(lock: true)
      render json: {}, status: :created
    else
      render json: {}, status: :internal_server_error
    end
  end

  def accept
    if @change_request.accept_request
      render json: @change_request, status: :ok
    else
      render json: @change_request.errors, status: :internal_server_error
    end
  end

  def decline
    if @change_request.decline_request
      render json: @change_request, status: :created, location: @change_request
    else
      render json: @change_request.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /change_requests/1
  # def update
  #   if @change_request.update(change_request_params)
  #     render json: @change_request
  #   else
  #     render json: @change_request.errors, status: :unprocessable_entity
  #   end
  # end

  # DELETE /change_requests/1
  # def destroy
  #   @change_request.destroy
  # end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_change_request
    @change_request = ChangeRequest.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def change_request_params
    params.require(:change_request).permit(:request_type, :item_id, :coordinates, :height, :photos_attributes => %i[url size name])
  end

end
