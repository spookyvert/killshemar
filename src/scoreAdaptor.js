https: //quiet-brushlands-57599.herokuapp.com/api/v1/

  class ScoreAdaptor {
    static async getUsers() {
      return await fetch('https://quiet-brushlands-57599.herokuapp.com/api/v1/users')
        .then(response =>
          response.json())
    }

    // static async updateScore() {
    //
    // }
  }