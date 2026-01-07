import { CreateUserParams, GetMenuParams, SignInParams } from "@/type";
import { router } from "expo-router";
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  platform: "com.rovergutierrez.studybreak-bite",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
  databaseId: '69588ba80000ec3ddce4',
  bucketId: '695b1e230023a6aed1d5',
  userCollectionId: '6959ba8c0022d900221d',
  categoriesCollectionId: '695b1a5e001361fe702b',
  menuCollectionId: '695b1ac50016e7596311',
  customizationsCollectionId: '695b1c14001098b90c2b',
  menuCustomizationsCollectionId: '695b1d0600139d2255e2',
}

// Function that creates a new user account, their session, and store them in the database
export const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint!)
  .setProject(appwriteConfig.projectId!)
  .setPlatform(appwriteConfig.platform)

export const account = new Account (client);
export const databases = new Databases(client);

// adding storage for seed database
export const storage = new Storage (client);
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

export const signOut = async() => {
  try {
    await account.deleteSession('current')
    router.replace('/(auth)/sign-in')
  } catch(e) {
    throw new Error(e as string);
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
    console.log(e)
    throw new Error(e as string)
  }
}


export const getMenu = async ({category, query}: GetMenuParams) => {
  try {
    const queries: string[] = [];
    
    if(category) queries.push(Query.equal('categories', category))
    if(query) queries.push(Query.search('name', query));

    const menus = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.menuCollectionId,
      queries
    )

    return menus.documents;
  } catch(e) {
    throw new Error(e as string);
  }
}

export const getCategories = async() => {
  try {
    const categories = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.categoriesCollectionId,
    )

    return categories.documents;
  } catch (e) {
    throw new Error(e as string)
  }
}