class Game < ApplicationRecord
  has_many :players
  has_many :users, through: :player
end
