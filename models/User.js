class User {
  constructor(
    username,
    password,
    activeLists,
    archivedLists,
    myLists,
    waitingLists
  ) {
    (this.username = username),
      (this.password = password),
      (this.activeLists = activeLists),
      (this.archivedLists = archivedLists),
      (this.myLists = myLists),
      (this.waitingLists = waitingLists);
  }
}
