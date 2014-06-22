<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
class primefactor {
	function __construct($num) {
		$this->num = $num;
                $this->factor=array(1);
		$run = true;
		while($run && $this->factor[0] != $num) {
			$run = $this->run();
		}
	}
	function run() {
		if($this->num == 1) {
			return ;
		}
		$this->root = ceil(sqrt($this->num)) + 1;
		$i = 2;
		while($i <= $this->root) {
			$this->count++;
			if($this->num % $i == 0) { echo $this->num . "\n";
				$this->factor[] = $i;
				$this->num = $this->num / $i;
				return true;
			}
			$i++;
		}
		$this->factor[] = $this->num;
		return false;
	}
}

?>
