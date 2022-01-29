import { Address, BigInt } from "@graphprotocol/graph-ts"
import {
  MockGroupies,
  Approval,
  ApprovalForAll,
  Transfer
} from "../generated/MockGroupies/MockGroupies"
import { Holder } from "../generated/schema"

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleTransfer(event: Transfer): void {
  let to = event.params.to;
  let from = event.params.from;
  let tokenId = event.params.id;
  if (from !== Address.zero()) {
    let fromEntity = Holder.load(from.toHex())
    if (!fromEntity) {
      fromEntity = new Holder(from.toHex())
    }
    let arr = fromEntity.ownedIds
    if (!arr) {
      arr = new Array<BigInt>()
    }
    let index = arr.indexOf(tokenId)
    if (index > -1) {
      arr.splice(index, 1)
    }
    fromEntity.ownedIds = arr
    fromEntity.save()
  }
  let toEntity = Holder.load(to.toHex())
  if (!toEntity) {
    toEntity = new Holder(to.toHex())
  }
  let arr = toEntity.ownedIds
  if (!arr) {
    arr = new Array<BigInt>()
  }
  arr.push(tokenId)
  toEntity.ownedIds = arr
  toEntity.save()
}
