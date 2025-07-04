import { buildSchema } from 'graphql';

const schema = buildSchema(`
  type Author {
    id: String!
    name: String!
    email: String
    imageUrl: String
    username: String
  }

  type Posts {
    id: ID!
    title: String!
    excerpt: String!
    date: String!
    category: String!
    content: String!
    author: Author!
    createdAt: String!
    updatedAt: String!

    }
    type Query {  
     getAllPosts: [Posts]
     getPost(postId: ID!): Posts
     getPostsByAuthor(authorId: String!): [Posts]
}
     input PostInput {
        title: String!
        excerpt: String!
        category: String!
        content: String! 

    } 
    type Mutation {
    createPost(postData: PostInput!): Posts
    deletePost(postId: ID!): String
    
    
    }

`);

export default schema;