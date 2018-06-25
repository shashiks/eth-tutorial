module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  //contracts_build_directory: "./src/contracts",
  networks: {
    development: {
      host: "localhost",
      port: 9090,
      network_id: "15", // Match our chain's network id
      from: '0x41aa7cc4598ad830a6b1597a82cb419419d6ec61'
    }
  }
};
