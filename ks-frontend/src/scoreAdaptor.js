class ScoreAdaptor {
  static async getUsers() {
    return await fetch('http://localhost:3000/api/v1/users')
      .then(response =>
        response.json())
  }

  // static async updateScore() {
  //
  // }
}
