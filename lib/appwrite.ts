import { CreateUserParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query } from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  platform: "com.rovergutierrez.studybreak-bite",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: '69588ba80000ec3ddce4',
  userCollectionId: '6959ba8c0022d900221d',
}

// Function that creates a new user account, their session, and store them in the database
export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint!)
  .setProject(appwriteConfig.projectId!)
  .setPlatform(appwriteConfig.platform)

export const account = new Account (client);
export const databases = new Databases(client);
const avatars = new Avatars (client);

export const createUser = async ({ email, password, name}: CreateUserParams) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password, name)
    if(!newAccount) throw Error;

    await signIn({email, password})

    const avatarUrl = avatars.getInitialsURL(name)
    
    // Create a new database user
    return await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email, name, avatar: avatarUrl
      }
    )

  } catch (e) {
    throw new Error (e as string);
  }
}

export const signIn = async ({email, password}: SignInParams) => {
  try {
    const session = await account.createEmailPasswordSession(email, password)
  } catch(e) {
    throw new Error(e as string)
  }
}

export const getCurrentUser = async() => {
  try {
    const currentAccount = await account.get();
    if(!currentAccount) throw Error;

    const currentUser = await databases.listDocuments (
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    )

    if(!currentUser) throw Error;

    return currentUser.documents[0];

  } catch(e) {
    throw new Error(e as string)
  }
}