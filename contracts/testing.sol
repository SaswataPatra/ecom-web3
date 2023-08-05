    it("checks for an event",async()=>{
      expect(transaction).to.emit(dappazon,"Buy");
