# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)
Player.destroy_all
User.destroy_all
Game.destroy_all


p1 = User.create(name: "Shemar")
p2 = User.create(name: "Seann")

game = Game.create(win: p1.id , loss: p2.id)

Player.create(user_id: game.win , game_id: game.id)
