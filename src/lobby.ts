import { Server } from "./server";
import { User } from "./user";

export class Lobby
{
  private users: Map<number, User>;

  public constructor(_server: Server)
  {
    this.users = new Map<number, User>();
  }

  public addUser(user: User)
  {
    this.broadcast((playerId, player) => player.sendEnterUser(user));
    this.broadcast((playerId, player) => user.sendEnterUser(player));
    user.sendEnterUser(user);
    user.chatRoom("Joined Game!");
    this.users.set(user.getUserId(), user);
  }

  public removeUser(user: User)
  {
    this.broadcast((playerId, player) => player.sendRemoveUser(user));
    user.chatRoom("Left Game!");
    this.users.delete(user.getUserId())
  }

  public getUser(userId: number)
  {
    return this.users.get(userId);
  }

  public chat(sender: User, message: string)
  {
    this.broadcast((playerId, player) => {
      player.sendChat(sender.getUserId(), sender.getUserData().displayName, message)
    });
  }

  private broadcast(handler: (playerId: number, player: User) => void)
  {
    for (const [id, player] of this.users)
    {
      if (player !== undefined)
      {
        handler(id, player);
      }
    }
  }

  public close()
  {
    this.users.clear();
  }
}