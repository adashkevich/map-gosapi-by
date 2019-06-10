class ItemsController < ApplicationController
  before_action :set_item, only: %i[show update destroy]

  # GET /items
  def index
    @items = Item.eager_load(:photos).where(deleted: false)

    render json: @items, include: { photos: { only: :url } }, except: %i[created_at updated_at parent_id deleted count]
  end

  # GET /items/1
  def show
    render json: @item, include: { photos: { only: :url } }, except: %i[created_at updated_at]
  end

  # POST /items
  def create
    @item = Item.new(item_params)

    if @item.save
      render json: @item, status: :created, location: @item
    else
      render json: @item.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /items/1
  # def update
  #   if @item.update(item_params)
  #     render json: @item
  #   else
  #     render json: @item.errors, status: :unprocessable_entity
  #   end
  # end

  # DELETE /items/1
  # def destroy
  #   @item.destroy
  # end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_item
      @item = Item.eager_load(:photos).find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def item_params
      params.require(:item).permit(:item_type, :coordinates, :count, :plant_date, :height, :count, :photos_attributes => %i[url size name])
    end
end
