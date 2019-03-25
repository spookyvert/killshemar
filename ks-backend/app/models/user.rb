class User < ApplicationRecord
   has_many :players
   has_many :games, through: :player

end
