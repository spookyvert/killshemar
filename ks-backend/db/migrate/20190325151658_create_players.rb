class CreatePlayers < ActiveRecord::Migration[5.2]
  def change
    create_table :players do |t|
      t.belongs_to :user, foreign_key: true
      t.belongs_to :game, foreign_key: true


    end
  end
end
