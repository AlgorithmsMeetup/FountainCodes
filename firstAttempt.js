// we host a simple text file
// and a video file that`s bigger
// they connect to them
// reconstruct them
// √ we host:

function toBinaryFromChar(char){
  return Number(char.charCodeAt(0).toString(2));
};

function fromBinaryStringToChar(binaryString){
  return String.fromCharCode(parseInt(binaryString, 2));
};

// Given original data.
var data = 'abc'

// Break data into blocks.
var blocks = data.split('');

// Encode blocks into packets.
var packets = [
  {
    totalPackets: 3,
    blockList: [0],
    payload: toBinaryFromChar(blocks[0])
  },
  {
    totalPackets: 3,
    blockList: [0,1],
    payload: toBinaryFromChar(blocks[0])^toBinaryFromChar(blocks[1])
  },
  {
    totalPackets: 3,
    blockList: [1,2],
    payload: toBinaryFromChar(blocks[1])^toBinaryFromChar(blocks[2])
  }
];

// Erase data to be rebuilt from packets.
data = [];

// Iterate through packets, decoding into blocks when possible.
while( packets.length ){
  var len = packets.length;
  for(var i = 0; i < len; i++){
    if( packets[i].blockList.length === 1 ){
      // packet determines block
      var blockNumber = packets[i].blockList[0];
      data[blockNumber] = packets[i].payload
      packets.splice(i, 1);
      len--;
      i--;
    } else {
      // Decode each payload as far as possible, remove blocknumber from unknown blocks.
      var blockLen = packets[i].blockList.length;
      for(var j = 0; j < blockLen; j++){
        var blockNumber = packets[i].blockList[j];
        if( data[blockNumber] ){
          packets[i].payload = packets[i].payload^data[blockNumber];
          packets[i].blockList.splice(j, 1);
          blockLen--;
          j--;
        }
      }

    }
    console.log(JSON.stringify(packets));
  }
}

console.log(data.map(fromBinaryStringToChar).join(''));
// }

/*
they receive and store packets
they receive a packet with r=1 AND at least datength packets
where r is the number of packets required to decode the data

they XOR packets with 1 unknown block against packets with 0 unknown blocks
if all blocks decoded, return data
else receive more packets

SPEC:
can you receive packets from a source?
given a few packets, does your algorithm decode all blocks possible?
given all necessary packets, does your algorithm return the data?

GIVE THEM:
client/packet receiver
function writeDataToFile(data) // turns buffer data into file from stream
*/
