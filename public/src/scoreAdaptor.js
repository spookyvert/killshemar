(() => {
  class ScoreAdaptor {
    static async getUsers() {
      return await fetch(`${window.GameConstants.BASE_URL}api/v1/users`).then(response =>
        response.json()
      );
    }
  }

  window.ScoreAdaptor = ScoreAdaptor;
})();
