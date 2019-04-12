// const BASE_URL = "https://quiet-brushlands-57599.herokuapp.com/"
class ScoreAdaptor {
  static async getUsers() {
    return await fetch(`${BASE_URL}api/v1/users`)
      .then(response =>
        response.json())
  }

  // static async updateScore() {
  //
  // }
}