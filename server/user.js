 class Users {
    constructor() {
        this.list = []
    }

    addUser(user) { //user: id, name, romm
        this.list = [...this.list, user];
    }

    findUserById(){
        const user = this.list.find(user => user.id === id );
        return user
    }

    removeUserById(id){
        this.list  = this.list.filter(user => user.id != id)
    }

    getListOfUserInRoom(roomName) {
        return this.list.filter(user => user.room === roomName)
    }
}

module.exports = {Users};