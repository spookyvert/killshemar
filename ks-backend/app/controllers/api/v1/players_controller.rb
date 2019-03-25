class Api::V1::PlayersController < ApplicationController

  def index
    @players = Player.all
    render json: @players
  end

  private

  def player_params
    params.permit(:user_id, :game_id)
  end
end
