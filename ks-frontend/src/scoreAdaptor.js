class ScoreAdaptor {
  static async getScores() {
    return await fetch('http://localhost:3000/api/v1/players')
      .then(response => response.json())
  }
}