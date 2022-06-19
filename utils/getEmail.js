const getEmail = (users, LoggedInUser) => (
    users?.filter((user) => user !== LoggedInUser?.email)[0]
)

export default getEmail