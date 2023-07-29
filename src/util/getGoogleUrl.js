function getGoogleOAuthURL() {
    const rootURL = "https://accounts.google.com/o/oauth2/v2/auth"

    const options = {
        redirect_uri: "http://localhost:8000/auth/google/callback",
        client_id: "490168595790-ndo2sl33jv0mg0ehm7na8flj3fhpq0dr.apps.googleusercontent.com",
        access_type: "offline",
        response_type: "code",
        prompt: "consent",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" ")
    }

    const qs = new URLSearchParams(options)
    console.log(qs.toString());
    return `${rootURL}?${qs.toString()}`
    
}

export default getGoogleOAuthURL