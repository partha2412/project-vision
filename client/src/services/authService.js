import api from './api'


export async function login(email, password) {
    try {
        const response = await api.post("/auth/login", { email, password }, { withCredentials: true });

        //data = response.data.data
        const { data } = response

        localStorage.setItem('authUser', JSON.stringify(response.data));
        console.log(response.data);
        return { res: response.data, status: true }
    }
    catch (err) {
        //console.log(err)
        return { res: err.response.data, status: false }
    }
}

export async function signup(name, email, phone_no, dob, address, password) {
    try {
        const result = await api.post("/auth/signup", { name, email, phone_no, dob, address, password });
        //console.log(result.data);
        localStorage.setItem('authUser', JSON.stringify(result.data));
        return { res: result.data, status: true }
    }
    catch (err) {
        //console.log(err.response.data)
        return { res: err.response.data, status: false }
    }
}
export async function logout() {
    localStorage.removeItem('authUser'); // Clear saved user data
    try {
        const result = await api.post('/auth/logout')
        console.log(result.data.message)
    } catch (error) {

    }

}