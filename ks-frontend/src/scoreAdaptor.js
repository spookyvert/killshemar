class ScoreAdaptor {
  static async getUsers() {
    return await fetch('http://shemar.local:3000/api/v1/users')
      .then(response =>
        response.json())
  }

  // static async updateScore() {
  //
  // }
}