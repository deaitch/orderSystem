let UserData = "";
const data = localStorage.getItem('userData')
if (data) {
    UserData = JSON.parse(data)
}
export default UserData