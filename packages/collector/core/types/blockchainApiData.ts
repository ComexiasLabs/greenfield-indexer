export interface BlockApiData {
  txs: Tx[];
  block: Block;
}

interface Block {
  header: Header;
}

interface Header {
  chain_id: string;
  height: string;
  time: string;
}

interface Tx {
  body: Body;
}

interface Body {
  messages: Message[];
}

interface Message {
  '@type': string;
  operator: string;
  resource: string;
  tags: Tags;
}

interface Tags {
  tags: Tag[];
}

interface Tag {
  key: string;
  value: string;
}
