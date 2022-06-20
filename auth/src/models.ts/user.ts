import mongoose from "mongoose";
import { Password } from "../services/password";

//* interface for the props that are needed to make a new User
interface UserAttrs {
  email: string,
  password: string;
}

//* interface that tells typescript that User has method called build() that takes types Userattrs
interface UserModel extends mongoose.Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

//* interface that describes the props that a User Document has
interface UserDoc extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  //* this changes the returned response object
  
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id
      delete ret._id
      delete ret.password
      delete ret.__v
    }  
  }
}
);

userSchema.pre('save', async function(done) {
  if (this.isModified('password')) {
    const hashed = await Password.toHash(this.get('password'))
    this.set('password', hashed)
  }
  done()
})

//adds the build method to the User through the statics mongoose method
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);



export { User };
