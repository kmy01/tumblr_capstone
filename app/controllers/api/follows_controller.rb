class Api::FollowsController < ApplicationController
  # before action stuff goes here

  def create
    @follow = Follow.new(
      follower_id: current_user.id,
      followee_id: follow_params[:followee_id]
    )
    if @follow.save
      render json: @follow
    else
      render json: @follow.errors.full_messages, status: 400
    end
  end

  def destroy
    @follow = Follow.find_by(params[:id])
    @follow.destroy
    render json: @follow
  end

  private

  def follow_parms
    params.require(:follow).permit(:followee_id)
  end
end