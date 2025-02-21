import { useContext } from 'react';
import { Safe } from '../Interfaces';
import { UserContext } from '../Context';

function useUser() {
    const userContext = useContext(UserContext);
    if (!userContext[0]) {
        throw new Error('ERROR: User is null or undefined.');
    }
    return userContext as Safe;
}

// Use this instead of useContext: What it does is converts User to Safe, which basically
// removes the possibility of it being null or undefined. That way you know you have a user,
// and don't have to unwrap it anymore.
export default useUser;
