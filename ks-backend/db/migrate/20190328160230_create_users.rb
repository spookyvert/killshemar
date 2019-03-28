class CreateUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      t.string :name
      t.integer :win, default: 0
      t.integer :score, default: 0

      t.timestamps
    end
  end
end
