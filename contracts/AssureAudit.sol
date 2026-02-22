// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title AssureAudit
 * @dev Anchors audit log hashes to the blockchain for tamper-evident integrity.
 */
contract AssureAudit {
    struct AuditAnchor {
        bytes32 rootHash;
        uint256 timestamp;
        string metadata;
    }

    mapping(uint256 => AuditAnchor) public anchors;
    uint256 public nextAnchorId;

    event AuditAnchored(uint256 indexed id, bytes32 indexed rootHash, uint256 timestamp);

    /**
     * @dev Anchors a new batch of audit logs.
     * @param _rootHash The Keccak256 hash of a batch of logs.
     * @param _metadata Optional info (e.g., "Batch 2024-Q1").
     */
    function anchorAudit(bytes32 _rootHash, string memory _metadata) public {
        anchors[nextAnchorId] = AuditAnchor({
            rootHash: _rootHash,
            timestamp: block.timestamp,
            metadata: _metadata
        });

        emit AuditAnchored(nextAnchorId, _rootHash, block.timestamp);
        nextAnchorId++;
    }

    /**
     * @dev Simple getter to verify an anchor.
     */
    function verifyAnchor(uint256 _id) public view returns (bytes32, uint256, string memory) {
        AuditAnchor memory anchor = anchors[_id];
        return (anchor.rootHash, anchor.timestamp, anchor.metadata);
    }
    
    function anchorCount() public view returns (uint256) {
        return nextAnchorId;
    }
}
