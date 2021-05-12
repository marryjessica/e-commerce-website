import json from "@/assets/fakeUsers.json";


export const userLogin = (params) => {
    var fakeusers = json.fakeusers
    for(var i = 0; i < 2; i++){
        console.log("ddd:", params.password)
        if(fakeusers[i].username == params.username && fakeusers[i].password == params.password){
            console.log("ccc:", params.password)
            return {data:1};
        } 
    }
    console.log('login error!')
    return { data: 0 };
}