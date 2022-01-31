import { Address, BigInt } from "@graphprotocol/graph-ts"
import {
  MockGroupies,
  Approval,
  ApprovalForAll,
  Transfer
} from "../generated/MockGroupies/MockGroupies"
import { Holder, Token } from "../generated/schema"

const stakingContract = '0x9c527cea78e7Ec46678F7007410a070A912927ca'

export function handleApprovalForAll(event: ApprovalForAll): void { }

export function handleTransfer(event: Transfer): void {
  let to = event.params.to;
  let from = event.params.from;
  let tokenId = event.params.id;
  if (from !== Address.zero()) {
    let fromEntity = Holder.load(from.toHex())
    if (!fromEntity) {
      fromEntity = new Holder(from.toHex())
    }
    console.log(`${from} === ${Address.fromString(stakingContract)}`)
    if (from === Address.fromString(stakingContract)) {
      console.log(`im in withdraw`)
      let tokenEntity = Token.load(to.toHex())
      if (!tokenEntity) {
        tokenEntity = new Token(to.toHex())
      }
      tokenEntity.isStaked = false
      tokenEntity.tokenID = tokenId
      tokenEntity.save()
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
  if (to === Address.fromString(stakingContract)) {
    console.log(`im in deposit`)
    let tokenEntity = Token.load(from.toHex())
    if (!tokenEntity) {
      tokenEntity = new Token(from.toHex())
    }
    tokenEntity.isStaked = true
    tokenEntity.tokenID = tokenId
    tokenEntity.save()
  }
  let arr = toEntity.ownedIds
  if (!arr) {
    arr = new Array<BigInt>()
  }
  arr.push(tokenId)
  toEntity.ownedIds = arr
  toEntity.save()
}
