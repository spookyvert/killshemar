class CreateUser < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      t.string :name
      t.integer :win
      t.integer :loss
      t.integer :score
    end
  end
end
