    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.19;

    /**
    * @title AssureAuditAnchor
    * @dev Anchors cryptographic fingerprints of audit logs to the blockchain.
    */
    contract AssureAuditAnchor {
        struct Anchor {
            bytes32 rootHash;
            uint256 timestamp;
            string metadata;
        }

        mapping(uint256 => Anchor) public anchors;
        uint256 public anchorCount;

        event AuditAnchored(uint256 indexed id, bytes32 indexed rootHash, uint256 timestamp);

        function anchorAudit(bytes32 _rootHash, string memory _metadata) public {
            anchorCount++;
            anchors[anchorCount] = Anchor({
                rootHash: _rootHash,
                timestamp: block.timestamp,
                metadata: _metadata
            });

            emit AuditAnchored(anchorCount, _rootHash, block.timestamp);
        }

        function verifyAnchor(uint256 _id) public view returns (bytes32, uint256, string memory) {
            require(_id > 0 && _id <= anchorCount, "Anchor ID does not exist");
            Anchor memory a = anchors[_id];
            return (a.rootHash, a.timestamp, a.metadata);
        }
    }
