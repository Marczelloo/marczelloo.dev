import { CssIcon } from "@/components/ui/icons/css-icon";
import { DiscordIcon } from "@/components/ui/icons/discord-icon";
import { EjsIcon } from "@/components/ui/icons/ejs-icon";
import { ExpressjsIcon } from "@/components/ui/icons/expressjs-icon";
import { JsIcon } from "@/components/ui/icons/js-icon";
import { LavalinkIcon } from "@/components/ui/icons/lavalink-icon";
import { MongodbIcon } from "@/components/ui/icons/mongodb-icon";
import { NodejsIcon } from "@/components/ui/icons/nodejs-icon";

export const techIcons: Record<string, React.ComponentType<any>> = {
  discordjs: DiscordIcon,
  nodejs: NodejsIcon,
  javascript: JsIcon,
  lavalink: LavalinkIcon,
  expressjs: ExpressjsIcon,
  css: CssIcon,
  ejs: EjsIcon,
  mongodb: MongodbIcon,
};
