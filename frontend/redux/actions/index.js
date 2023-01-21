// actions in redux are calls to action, whenever you want to 
// alter something in the redux state you call an action and the action will call 
// firestore and alter something in the database.
import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE, USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, USERS_LIKES_STATE_CHANGE, CLEAR_DATA} from "../constants/index";
import firebase from "firebase/compat";

export function clearData() {
    return ((dispatch)=> {
        dispatch({type: CLEAR_DATA})
    })
}

export function fetchUser() {
    return((dispatch) => {
        // make a call to firebase and when we see that snapshot/user exists we will send a dispatch
        firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    dispatch({type: USER_STATE_CHANGE, currentUser: snapshot.data()})
                } else {
                    console.log('does not exist')
                }
            })
    })
}

export function fetchUserPosts() {
    return((dispatch) => {
        // make a call to firebase and when we see that snapshot/user exists we will send a dispatch
        firebase.firestore()
            .collection("posts")
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return {id, ...data}
                })
                dispatch({type: USER_POSTS_STATE_CHANGE, posts})

            })
    })
}

export function fetchUserFollowing() {
    return((dispatch) => {
        // make a call to firebase and when we see that snapshot/user exists we will send a dispatch
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .onSnapshot((snapshot) => {
                let following = snapshot.docs.map(doc => {
                    const id = doc.id;
                    return id
                })
                dispatch({type: USER_FOLLOWING_STATE_CHANGE, following})
                for (let i = 0; i< following.length; i++) {
                    dispatch(fetchUsersData(following[i], true))
                }
            })
    })
}

export function fetchUsersData(uid, getPosts) {
    return((dispatch, getState) => {
        const found = getState().usersState.users.some(el => el.uid === uid);

        if (!found) {
            firebase.firestore()
            .collection("users")
            .doc(uid)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {
                    let user = snapshot.data();
                    user.uid = snapshot.id;
                    dispatch({type: USERS_DATA_STATE_CHANGE, user});
                    
                  
                } else {
                    console.log('does not exist')
                }
            })

            if (getPosts) {
                dispatch(fetchUsersFollowingPosts(uid))
            }



        }
    })
}

export function fetchUsersFollowingPosts(uid) {
    return((dispatch, getState) => {
        // make a call to firebase and when we see that snapshot/user exists we will send a dispatch
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .orderBy("creation", "asc")
            .get()
            .then((snapshot) => {

                const uid = snapshot.query._delegate._query.D.path.segments[1];
                const user = getState().usersState.users.find(el => el.uid === uid);
                console.log("fetch user posts", snapshot)
                let posts = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return {id, ...data, user}
                })
                for(let i = 0; i < posts.length; i++){
                    dispatch(fetchUsersFollowingLikes(uid, posts[i].id))
                }
                dispatch({type: USERS_POSTS_STATE_CHANGE, posts, uid})
                console.log(getState())
            })
    })
}

export function fetchUsersFollowingLikes(uid, postId) {
    return((dispatch, getState) => {
        // make a call to firebase and when we see that snapshot/user exists we will send a dispatch
        firebase.firestore()
            .collection("posts")
            .doc(uid)
            .collection("userPosts")
            .doc(postId)
            .collection('likes')
            .doc(firebase.auth().currentUser.uid)
            .onSnapshot((snapshot) => {
                const postId = snapshot._delegate._key.path.segments[3];
                
                let currentUserLike = false;
                if(snapshot.exists) {
                    currentUserLike = true
                }
                console.log("fetch user following list", postId)
                 dispatch({type: USERS_LIKES_STATE_CHANGE, postId, currentUserLike})
                console.log(getState())
            })
    })
}